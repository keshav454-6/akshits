import os
import sys

# Ensure backend directory and its detectors are in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, 'backend')

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Import the initialized Flask application
from app import app as flask_app

class VercelPrefixMiddleware:
    """
    Middleware ensuring PATH_INFO has the '/api' prefix so Flask's @app.route('/api/...')
    matches regardless of whether Vercel strips the prefix or keeps it.
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path = environ.get('PATH_INFO', '')
        if not path.startswith('/api'):
            environ['PATH_INFO'] = '/api' + (path if path.startswith('/') else '/' + path)
        return self.wsgi_app(environ, start_response)

app = VercelPrefixMiddleware(flask_app)
