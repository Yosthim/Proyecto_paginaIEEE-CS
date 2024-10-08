package org.ieee.paginaieee.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Data
public class Noticia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String categoria;
    private String autor;
    private String fuente;
    @Lob
    private String contenido;
    private String imagen;
    private String status;

    @Temporal(TemporalType.DATE)
    private Date fechaDePublicacion;

}