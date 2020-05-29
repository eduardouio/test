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