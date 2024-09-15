package org.ieee.paginaieee.controller;

import org.ieee.paginaieee.dto.EventoDetalleDTO;
import org.ieee.paginaieee.dto.EventoListaDTO;
import org.ieee.paginaieee.dto.SuscripcionDTO;
import org.ieee.paginaieee.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {
    @Autowired
    private EventoService eventoService;
    //Endpoint para obtener la lista de eventos(nombre,fecha,ubicacion)
    @GetMapping
    public ResponseEntity<List<EventoListaDTO>> obtenerEventos() {return ResponseEntity.ok(eventoService.obtenerTodosLosEventos());}
    // Endpoint para obtener los detalles de un evento específica por id
    @GetMapping("/{id}")
    public ResponseEntity<EventoDetalleDTO> obtenerEventoPorId(@PathVariable Long id){
        try{
            EventoDetalleDTO evento=eventoService.obtenerDetallesDeEvento(id);
            return new ResponseEntity<>(evento, HttpStatus.OK);
        }catch(RuntimeException e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    //Endpoint para procesar la suscripción con nombre y correo para un evento
    @PostMapping("/{id}/suscripcion")
    public ResponseEntity<String> procesarEventoSuscripcion(@PathVariable Long id, @RequestBody SuscripcionDTO suscripcionDTO){
        eventoService.procesarEventoSuscripcion(id,suscripcionDTO);
        return new ResponseEntity<>("Suscripcion procesada", HttpStatus.CREATED);
    }
}
