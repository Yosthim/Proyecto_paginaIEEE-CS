package org.ieee.paginaieee.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "suscripciones")
public class Suscripcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idsuscripcion")
    private Long id;
    @Column(name="nombre_usuario")
    private String nombre;
    private String correo;
    @ManyToOne
    @JoinColumn(name="id_evento")
    private Evento evento;
}
