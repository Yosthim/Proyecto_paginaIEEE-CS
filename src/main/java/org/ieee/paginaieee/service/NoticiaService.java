package org.ieee.paginaieee.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import org.ieee.paginaieee.dto.NoticiaListaDTO;
import org.ieee.paginaieee.dto.NoticiaDetalleDTO;
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
            dto.setId(noticia.getId());
            dto.setTitle(noticia.getTitulo());
            dto.setImg(noticia.getImagen());
            dto.setDate(noticia.getFechaDePublicacion());
            dto.setCategory(noticia.getCategoria());
            dto.setStatus(noticia.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    // Obtener detalles de una noticia específica
    public NoticiaDetalleDTO obtenerDetallesDeNoticia(Long id) {
        Noticia noticia = noticiaRepository.findById(id).orElseThrow(() -> new RuntimeException("Noticia no encontrada"));

        NoticiaDetalleDTO dto = new NoticiaDetalleDTO();
        dto.setTitle(noticia.getTitulo());
        dto.setCategory(noticia.getCategoria());
        dto.setAutor(noticia.getAutor());
        dto.setSource(noticia.getFuente());
        dto.setContent(noticia.getContenido());
        dto.setImg(noticia.getImagen());
        dto.setDate(noticia.getFechaDePublicacion());
        dto.setStatus(noticia.getStatus());

        return dto;
    }

    // Guardar una nueva noticia
    public void guardarNoticia(NoticiaDetalleDTO noticiaDTO) {
        Noticia noticia = new Noticia();
        noticia.setTitulo(noticiaDTO.getTitle());
        noticia.setCategoria(noticiaDTO.getCategory());
        noticia.setAutor(noticiaDTO.getAutor());
        noticia.setFuente(noticiaDTO.getSource());
        noticia.setContenido(noticiaDTO.getContent());
        noticia.setImagen(noticiaDTO.getImg());
        noticia.setFechaDePublicacion(noticiaDTO.getDate());
        noticia.setStatus("Visible");

        noticiaRepository.save(noticia);
    }

    // Método para actualizar una noticia existente
    public void actualizarNoticia(Long id, NoticiaDetalleDTO noticiaDTO) {
        Noticia noticia = noticiaRepository.findById(id).orElseThrow(() -> new RuntimeException("Noticia no encontrada"));

        noticia.setTitulo(noticiaDTO.getTitle());
        noticia.setCategoria(noticiaDTO.getCategory());
        noticia.setAutor(noticiaDTO.getAutor());
        noticia.setFuente(noticiaDTO.getSource());
        noticia.setContenido(noticiaDTO.getContent());
        noticia.setImagen(noticiaDTO.getImg());
        noticia.setFechaDePublicacion(noticiaDTO.getDate());

        noticiaRepository.save(noticia);
    }

    // Método para cambiar el status de una noticia
    public void cambiarStatus(Long id, String status) {
        Noticia noticia = noticiaRepository.findById(id).orElseThrow(() -> new RuntimeException("Noticia no encontrada"));
        noticia.setStatus(status);
        noticiaRepository.save(noticia);
    }
}