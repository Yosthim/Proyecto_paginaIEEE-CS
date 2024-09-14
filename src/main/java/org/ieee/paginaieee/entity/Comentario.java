package org.ieee.paginaieee.entity;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Data
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenido;
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "noticia_id")
    private Noticia noticia;
}
