from registro_inversionista.models import Usuario, Contrato

from registro_inversionista.views import guardar_contratos

def run():
    usuarios = Usuario.objects.all()

    for usuario in usuarios:

        guardar_contratos(usuario.nombres, usuario.apellidos, usuario.cedula, usuario)
