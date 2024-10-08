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
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/eventos")
public class EventoController {
    @Autowired
    private EventoService eventoService;
    //Endpoint para obtener la lista de eventos(nombre,fecha,ubicacion)
    @GetMapping
    public List<EventoListaDTO> obtenerEventos() {return eventoService.obtenerTodosLosEventos();}
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
        try {
            eventoService.procesarEventoSuscripcion(id,suscripcionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Suscripción creada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Suscripcion duplicada");
        }
    }
    //Endpoint para guardar el evento
    @PostMapping
    public ResponseEntity<Void> guardarEvento(@RequestBody EventoDetalleDTO eventoDetalleDTO){
        eventoService.guardarEvento(eventoDetalleDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    // Endpoint para actualizar un evento existente
    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizarEvento(@PathVariable Long id,@RequestBody EventoDetalleDTO eventoDetalleDTO){
        eventoService.actualizarEvento(id, eventoDetalleDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    // Endpoint para actualizar solo el campo visible de un evento existente
    @PatchMapping("/{id}/visible")
    public ResponseEntity<Void> actualizarVisible(@PathVariable Long id, @RequestBody Map<String, Boolean> actualizacionVisible) {
        try {
            Boolean visible = actualizacionVisible.get("visible");
            eventoService.actualizarCampoVisible(id, visible);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
