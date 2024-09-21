package org.ieee.paginaieee.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Data
public class EventoDetalleDTO {
    private String nombre;
    private String descripcion;
    private LocalDate fecha;
    private LocalTime hora;
    private String imagen;
    private String ubicacion;
}
