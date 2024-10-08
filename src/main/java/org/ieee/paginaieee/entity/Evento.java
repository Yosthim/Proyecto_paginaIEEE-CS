package org.ieee.paginaieee.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@Table(name = "eventos")
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Long id;
    private String nombre;
    private String descripcion;
    private String ubicacion;
    private String imagen;
    private Boolean visible;
    private LocalDate fecha;
    private LocalTime hora;
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private List<Suscripcion> suscripciones;

}
