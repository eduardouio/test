from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.http import FileResponse, Http404


@require_http_methods(["GET"])
def pdf_view_terminos_legales(request):
    try:
        return FileResponse(open('creceEcuador/static/assets/terminos_legales.pdf', 'rb'), content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()

@require_http_methods(["GET"])
def pdf_view_privacidad_proteccion_datos(request):
    try:
        return FileResponse(open('creceEcuador/static/assets/privacidad_proteccion_datos.pdf', 'rb'), content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()

@require_http_methods(["GET"])
def pdf_view_manual_solicitante(request):
    try:
        return FileResponse(open('creceEcuador/static/assets/manual_solicitante.pdf', 'rb'), content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()

@require_http_methods(["GET"])
def pdf_view_manual_inversionista(request):
    try:
        return FileResponse(open('creceEcuador/static/assets/manual_inversionista.pdf', 'rb'), content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()