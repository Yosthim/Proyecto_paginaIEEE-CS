package org.ieee.paginaieee.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class NoticiaDetalleDTO {
    private String titulo;
    private String contenido;
    private String imagen;
    private String autor;
    private Date fechaDePublicacion;
    private List<ComentarioDTO> comentarios;
}
