import pytest
import requests

host = "http://127.0.0.1:8000"
url = host+"/solicitudes/"

def test_response_is_200():
    response = requests.get(url)
    assert response.status_code == 200 

def test_content_type_is_json():
    response = requests.get(url)
    assert response.headers['Content-Type'] == 'application/json' 

def test_datatype_response():
    response = requests.get(url)
    response_body = response.json()
    assert isinstance(response_body['data'], list)
    assert type(response_body['cantidad']) is int
    assert type(response_body['inicio']) is int
