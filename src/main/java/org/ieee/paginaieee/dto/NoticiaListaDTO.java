package org.ieee.paginaieee.dto;

import lombok.Data;
import java.util.Date;

@Data
public class NoticiaListaDTO {
    private Long id;
    private String title;
    private String img;
    private Date date;
}