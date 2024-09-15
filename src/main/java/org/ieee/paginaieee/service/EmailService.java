package org.ieee.paginaieee.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    public void enviarCorreo(String destinatario, String nombre, String nombreEvento, Date fechaEvento, String ubicacion){
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy 'a las' HH:mm");
        String fechaFormato = dateFormat.format(fechaEvento);
        SimpleMailMessage mensaje= new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Registrado con éxito al evento");
        mensaje.setText(String.format(
                "Estimado %s,\n\nTe encuentras registrado al Evento %s.\nTe esperamos el día %s en %s.",
                nombre, nombreEvento, fechaFormato, ubicacion
        ));
        mailSender.send(mensaje);
    }
}
