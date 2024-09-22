package org.ieee.paginaieee.service;

import org.ieee.paginaieee.dto.EventoDetalleDTO;
import org.ieee.paginaieee.dto.EventoListaDTO;
import org.ieee.paginaieee.dto.SuscripcionDTO;
import org.ieee.paginaieee.entity.Evento;
import org.ieee.paginaieee.repository.EventoRepository;
import org.ieee.paginaieee.repository.SuscripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoService {
    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private SuscripcionRepository suscripcionRepository;
    @Autowired
    private SuscripcionService suscripcionService;
    @Autowired
    private EmailService emailService;
    //Obtener todos los eventos(solo nombre,fecha,ubicacion)
    public List<EventoListaDTO> obtenerTodosLosEventos(){
        return eventoRepository.findAll().stream().map(evento ->{
            EventoListaDTO eventos = new EventoListaDTO();
            eventos.setNombre(evento.getNombre());
            eventos.setFecha(evento.getFecha());
            eventos.setHora(evento.getHora());
            eventos.setId(evento.getId());
            eventos.setImagen(evento.getImagen());
            eventos.setUbicacion(evento.getUbicacion());
            return eventos;
        }).collect(Collectors.toList());
    }
    // Obtener detalles de un evento específico
    public EventoDetalleDTO obtenerDetallesDeEvento(Long id){
        Evento evento=eventoRepository.findById(id).orElseThrow(() -> new RuntimeException("Evento no encontrada"));
        EventoDetalleDTO eventoDetalle = new EventoDetalleDTO();
        eventoDetalle.setNombre(evento.getNombre());
        eventoDetalle.setDescripcion(evento.getDescripcion());
        eventoDetalle.setFecha(evento.getFecha());
        eventoDetalle.setHora(evento.getHora());
        eventoDetalle.setImagen(evento.getImagen());
        eventoDetalle.setUbicacion(evento.getUbicacion());
       return eventoDetalle;
    }
    //Procesar la suscripción y asociarla a un evento
    public void procesarEventoSuscripcion(Long id, SuscripcionDTO suscripcionDTO){
        //Comprobar si existe un evento
        Evento evento=eventoRepository.findById(id).orElseThrow(() -> new RuntimeException("Evento no encontrado"));
        //Comprobar si existe la suscripcion
        boolean estado=suscripcionService.obtenerSuscripcion(suscripcionDTO.getCorreo(),evento);
        if(estado){
            //Crear la suscripcion
            suscripcionService.creacionSuscripcion(evento,suscripcionDTO);
            //Enviar correo de confirmación
            emailService.enviarCorreo(
                    suscripcionDTO.getCorreo(),
                    suscripcionDTO.getNombre(),
                    evento.getNombre(),
                    evento.getFecha(),
                    evento.getHora(),
                    evento.getUbicacion()
            );
        }else{
            throw new RuntimeException("Correo ya suscrito a este evento");
        }
    }

}
