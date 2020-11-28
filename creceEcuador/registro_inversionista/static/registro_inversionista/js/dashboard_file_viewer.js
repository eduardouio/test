const viewerConfig = {
    embedMode: "LIGHT_BOX"
};

function previewFile(url_contrato, nombre_contrato)
{
    var full_url_contrato = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    full_url_contrato += url_contrato;
    /* Initialize the AdobeDC View object */
    var adobeDCView = new AdobeDC.View({
        /* Pass your registered client id */
        clientId: "3559b308452340dd86b2c1978eae5868"
    });

    /* Invoke the file preview API on Adobe DC View object */
    adobeDCView.previewFile({
        /* Pass information on how to access the file */
        content: {
            /* Location of file where it is hosted */
            location: {
                url: full_url_contrato,
                /*
                If the file URL requires some additional headers, then it can be passed as follows:-
                header: [
                    {
                        key: "<HEADER_KEY>",
                        value: "<HEADER_VALUE>",
                    }
                ]
                */
            },
        },
        /* Pass meta data of file */
        metaData: {
            /* file name */
            fileName: nombre_contrato + ".pdf"
        }
    }, viewerConfig);

    return false;
};