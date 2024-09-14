package org.ieee.paginaieee.dto;

import lombok.Data;
import java.util.Date;

@Data
public class NoticiaListaDTO {
    private String titulo;
    private String imagen;
    private Date fechaDePublicacion;
}