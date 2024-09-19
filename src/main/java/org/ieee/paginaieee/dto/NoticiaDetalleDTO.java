package org.ieee.paginaieee.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class NoticiaDetalleDTO {
    private String title;
    private String source;
    private String img;
    private String autor;
    private Date date;
    private List<ComentarioDTO> comment;
}
