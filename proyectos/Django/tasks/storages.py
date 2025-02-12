from django.core.files.storage import Storage
from django.conf import settings
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
import os
import pickle
import io

class GoogleDriveStorage(Storage):
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/drive.file']
        self.creds = None
        self.service = None
        self.initialize_service()

    def initialize_service(self):
        # El archivo token.pickle almacena los tokens de acceso y actualización del usuario
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                self.creds = pickle.load(token)

        # Si no hay credenciales válidas disponibles, permite que el usuario inicie sesión
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', self.SCOPES)
                self.creds = flow.run_local_server(port=0)
            
            # Guardar las credenciales para la próxima ejecución
            with open('token.pickle', 'wb') as token:
                pickle.dump(self.creds, token)

        self.service = build('drive', 'v3', credentials=self.creds)

    def _save(self, name, content):
        try:
            # Crear el archivo metadata
            file_metadata = {
                'name': os.path.basename(name),
                'parents': [settings.GOOGLE_DRIVE_STORAGE_FOLDER_ID]  # ID de la carpeta en Drive
            }

            # Preparar el contenido del archivo
            content.seek(0)
            media = MediaIoBaseUpload(
                content,
                mimetype='application/octet-stream',
                resumable=True,
                chunksize=1024*1024
            )

            # Subir el archivo
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, webViewLink'
            ).execute()

            return file.get('webViewLink')  # Retorna el enlace para ver el archivo

        except Exception as e:
            print(f"Error subiendo archivo a Google Drive: {str(e)}")
            return None

    def url(self, name):
        return name  # Retorna la URL almacenada

    def delete(self, name):
        try:
            # Buscar el archivo por nombre
            response = self.service.files().list(
                q=f"name='{os.path.basename(name)}'",
                spaces='drive',
                fields='files(id, name)'
            ).execute()

            files = response.get('files', [])
            if files:
                # Eliminar el archivo
                self.service.files().delete(fileId=files[0]['id']).execute()
                return True
            return False

        except Exception as e:
            print(f"Error eliminando archivo de Google Drive: {e}")
            return False

    def exists(self, name):
        return False