package org.ieee.paginaieee.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class Noticia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String tema;
    private String contenido;
    private String detalles;
    private String detallesContent;
    private String adicional;
    private String contextAdicional;
    private String imagen;
    private String sourceLink;

    @Temporal(TemporalType.DATE)
    private Date fechaDePublicacion;

    @OneToMany(mappedBy = "noticia", cascade = CascadeType.ALL)
    private List<Comentario> comentarios;
}