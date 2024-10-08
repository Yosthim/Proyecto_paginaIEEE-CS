package org.ieee.paginaieee.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventoListaDTO {
    private Long id;
    private String nombre;
    private LocalDate fecha;
    private LocalTime hora;
    private String imagen;
    private String ubicacion;
}
