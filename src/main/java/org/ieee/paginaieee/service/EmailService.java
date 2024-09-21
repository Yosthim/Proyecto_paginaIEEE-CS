package org.ieee.paginaieee.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    public void enviarCorreo(String destinatario, String nombre, String nombreEvento, LocalDate fechaEvento, LocalTime hora, String ubicacion){
        DateTimeFormatter fechaFormat = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        DateTimeFormatter horaFormat = DateTimeFormatter.ofPattern("HH:mm");
        String fechaFormato = fechaEvento.format(fechaFormat);
        String horaFormato = hora.format(horaFormat);
        SimpleMailMessage mensaje= new SimpleMailMessage();
        mensaje.setTo(destinatario);
        mensaje.setSubject("Registrado con éxito al evento");
        mensaje.setText(String.format(
                "Estimado %s,\n\nTe encuentras registrado al Evento %s.\nTe esperamos el día %s a las %s en %s.",
                nombre, nombreEvento, fechaFormato,horaFormato, ubicacion
        ));
        mailSender.send(mensaje);
    }
}
