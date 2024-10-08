package org.ieee.paginaieee.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ieee.paginaieee.dto.NoticiaDetalleDTO;
import org.ieee.paginaieee.dto.NoticiaListaDTO;
import org.ieee.paginaieee.service.NoticiaService;
import org.ieee.paginaieee.service.ImageService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {

    @Autowired
    private NoticiaService noticiaService;

    @Autowired
    private ImageService imageService;

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

    // Endpoint para guardar una nueva noticia con imagen
    @PostMapping
    public ResponseEntity<Void> guardarNoticia(@RequestPart("noticia") NoticiaDetalleDTO noticiaDTO, @RequestPart(value = "file") MultipartFile file) {
        try {
            String imageUrl = imageService.uploadImage(file);
            noticiaDTO.setImg(imageUrl);

            // Guardar la noticia
            noticiaService.guardarNoticia(noticiaDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para actualizar una noticia existente
    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizarNoticia(@PathVariable Long id, @RequestPart("noticia") NoticiaDetalleDTO noticiaDTO, @RequestPart(value = "file") MultipartFile file) {
        try {
            noticiaService.actualizarNoticia(id, noticiaDTO, file);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para cambiar el status de una noticia
    @PutMapping("/status/{id}")
    public ResponseEntity<Void> cambiarStatus(@PathVariable Long id, @RequestParam String status) {
        noticiaService.cambiarStatus(id, status);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
