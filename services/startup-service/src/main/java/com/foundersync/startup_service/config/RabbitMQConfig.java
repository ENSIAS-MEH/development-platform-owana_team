package com.foundersync.startup_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String STARTUP_EXCHANGE        = "foundersync.startup.exchange";

    public static final String NOTIFICATION_QUEUE      = "foundersync.notification.queue";
    public static final String CHAT_QUEUE              = "foundersync.chat.queue";

    public static final String STARTUP_CREATED_KEY = "startup.created";
    public static final String JOIN_REQUEST_RECEIVED_KEY = "join.request.received";
    public static final String JOIN_REQUEST_ACCEPTED_KEY = "join.request.accepted";
    public static final String JOIN_REQUEST_IGNORED_KEY  = "join.request.ignored";
    public static final String MEMBER_REMOVED_KEY        = "member.removed";
    public static final String MEMBER_JOINED_KEY         = "member.joined";
    public static final String STARTUP_BANNED_KEY        = "startup.banned";
    public static final String STARTUP_UNBANNED_KEY      = "startup.unbanned";
    public static final String STARTUP_REPORTED_KEY      = "startup.reported";
    public static final String STARTUP_DELETED_KEY       = "startup.deleted";


    @Bean
    public TopicExchange startupExchange() {
        return new TopicExchange(STARTUP_EXCHANGE);
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(NOTIFICATION_QUEUE).build();
    }

    @Bean
    public Queue chatQueue() {
        return QueueBuilder.durable(CHAT_QUEUE).build();
    }

    @Bean
    public Binding notificationBinding() {
        return BindingBuilder
                .bind(notificationQueue())
                .to(startupExchange())
                .with("#");
    }

    @Bean
    public Binding chatBinding() {
        return BindingBuilder
                .bind(chatQueue())
                .to(startupExchange())
                .with("join.request.received");
    }

    @Bean
    public Binding chatStartupCreatedBinding() {
        return BindingBuilder
                .bind(chatQueue())
                .to(startupExchange())
                .with(STARTUP_CREATED_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}