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
            dto.setTitle(noticia.getTitulo());
            dto.setImg(noticia.getImagen());
            dto.setId(noticia.getId());
            dto.setDate(noticia.getFechaDePublicacion());
            return dto;
        }).collect(Collectors.toList());
    }

    // Obtener detalles de una noticia específica
    public NoticiaDetalleDTO obtenerDetallesDeNoticia(Long id) {
        Noticia noticia = noticiaRepository.findById(id).orElseThrow(() -> new RuntimeException("Noticia no encontrada"));

        NoticiaDetalleDTO dto = new NoticiaDetalleDTO();
        dto.setTitle(noticia.getTitulo());
        dto.setSource(noticia.getContenido());
        dto.setImg(noticia.getImagen());
        dto.setAutor(noticia.getAutor());
        dto.setDate(noticia.getFechaDePublicacion());
        dto.setComment(noticia.getComentarios().stream().map(comentario -> {
            ComentarioDTO comentarioDTO = new ComentarioDTO();
            comentarioDTO.setSource(comentario.getContenido());
            comentarioDTO.setName(comentario.getNombre());
            return comentarioDTO;
        }).collect(Collectors.toList()));

        return dto;
    }
}