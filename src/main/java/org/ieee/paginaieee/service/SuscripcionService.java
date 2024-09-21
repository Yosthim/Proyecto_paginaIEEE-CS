package org.ieee.paginaieee.service;

import org.ieee.paginaieee.dto.EventoDetalleDTO;
import org.ieee.paginaieee.dto.SuscripcionDTO;
import org.ieee.paginaieee.entity.Evento;
import org.ieee.paginaieee.entity.Suscripcion;
import org.ieee.paginaieee.repository.SuscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SuscripcionService {
    @Autowired
    private SuscripcionRepository suscripcionRepository;
    // Verificar si hay una suscripcion con ese correo
    public boolean obtenerSuscripcion(String correo, Evento evento){
        // Buscar la suscripción por correo y fk
        Optional<Suscripcion> suscripcion = suscripcionRepository.findByCorreoAndEvento(correo, evento);
        return suscripcion.isEmpty();
    }
    public void creacionSuscripcion(Evento evento, SuscripcionDTO suscripcionDTO){
        //Creación de nueva suscripción a partir del DTO
        Suscripcion suscripcion=new Suscripcion();
        suscripcion.setNombre(suscripcionDTO.getNombre());
        suscripcion.setCorreo(suscripcionDTO.getCorreo());
        suscripcion.setEvento(evento);
        //Guardar la suscripcion en la base de datos
        suscripcionRepository.save(suscripcion);

    }
}
