package org.ieee.paginaieee.dto;

import lombok.Data;

import java.util.Date;

@Data
public class EventoListaDTO {
    private String nombre;
    private Date fecha;
    private String ubicacion;
}
