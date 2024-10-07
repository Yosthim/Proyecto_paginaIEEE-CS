package org.ieee.paginaieee.dto;

import lombok.Data;
import java.util.Date;

@Data
public class NoticiaDetalleDTO {
    private String title;
    private String category;
    private String autor;
    private String source;
    private String content;
    private String img;
    private Date date;
    private String status;
}
