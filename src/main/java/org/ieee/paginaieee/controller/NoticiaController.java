package org.ieee.paginaieee.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ieee.paginaieee.dto.NoticiaDetalleDTO;
import org.ieee.paginaieee.dto.NoticiaListaDTO;
import org.ieee.paginaieee.service.NoticiaService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {

    @Autowired
    private NoticiaService noticiaService;

    // Endpoint para obtener la lista de noticias (imagen, título, fecha)
    @GetMapping
    public List<NoticiaListaDTO> obtenerNoticias() {
        return noticiaService.obtenerTodasLasNoticias();
    }

    // Endpoint para obtener los detalles de una noticia específica por id
    @GetMapping("/{id}")
    public ResponseEntity<NoticiaDetalleDTO> obtenerNoticiaPorId(@PathVariable Long id) {
        try{
            NoticiaDetalleDTO noticia = noticiaService.obtenerDetallesDeNoticia(id);
            return new ResponseEntity<>(noticia, HttpStatus.OK);
        }catch (RuntimeException e){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para guardar una nueva noticia
    @PostMapping
    public ResponseEntity<Void> guardarNoticia(@RequestBody NoticiaDetalleDTO noticiaDTO) {
        noticiaService.guardarNoticia(noticiaDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Endpoint para actualizar una noticia existente
    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizarNoticia(@PathVariable Long id, @RequestBody NoticiaDetalleDTO noticiaDTO) {
        noticiaService.actualizarNoticia(id, noticiaDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
