package org.ieee.paginaieee.dto;

import lombok.Data;

import java.util.Date;

@Data
public class EventoDetalleDTO {
    private String nombre;
    private String descripcion;
    private Date fecha;
    private String ubicacion;
}
