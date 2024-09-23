package org.ieee.paginaieee.dto;

import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class NoticiaDetalleDTO {
    private String title;
    private String tema;
    private String source;
    private String details;
    private String detailsContent;
    private String aditional;
    private String contextAditional;
    private String img;
    private String sourceLink;
    private Date date;

    private List<ComentarioDTO> comment;
}
