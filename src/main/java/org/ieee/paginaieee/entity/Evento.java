package org.ieee.paginaieee.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
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
    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha;
    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private List<Suscripcion> suscripciones;

}
