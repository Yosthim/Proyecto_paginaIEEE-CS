package org.ieee.paginaieee.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.ieee.paginaieee.dto.NoticiaListaDTO;
import org.ieee.paginaieee.dto.NoticiaDetalleDTO;
import org.ieee.paginaieee.dto.ComentarioDTO;
import org.ieee.paginaieee.entity.Noticia;
import org.ieee.paginaieee.repository.NoticiaRepository;

@Service
public class NoticiaService {
    @Autowired
    private NoticiaRepository noticiaRepository;

    // Obtener todas las noticias (solo imagen, título, fecha)
    public List<NoticiaListaDTO> obtenerTodasLasNoticias() {
        return noticiaRepository.findAll().stream().map(noticia -> {
            NoticiaListaDTO dto = new NoticiaListaDTO();
            dto.setTitulo(noticia.getTitulo());
            dto.setImagen(noticia.getImagen());
            dto.setFechaDePublicacion(noticia.getFechaDePublicacion());
            return dto;
        }).collect(Collectors.toList());
    }

    // Obtener detalles de una noticia específica
    public NoticiaDetalleDTO obtenerDetallesDeNoticia(Long id) {
        Noticia noticia = noticiaRepository.findById(id).orElseThrow(() -> new RuntimeException("Noticia no encontrada"));

        NoticiaDetalleDTO dto = new NoticiaDetalleDTO();
        dto.setTitulo(noticia.getTitulo());
        dto.setContenido(noticia.getContenido());
        dto.setImagen(noticia.getImagen());
        dto.setAutor(noticia.getAutor());
        dto.setFechaDePublicacion(noticia.getFechaDePublicacion());
        dto.setComentarios(noticia.getComentarios().stream().map(comentario -> {
            ComentarioDTO comentarioDTO = new ComentarioDTO();
            comentarioDTO.setContenido(comentario.getContenido());
            comentarioDTO.setNombre(comentario.getNombre());
            return comentarioDTO;
        }).collect(Collectors.toList()));

        return dto;
    }
}