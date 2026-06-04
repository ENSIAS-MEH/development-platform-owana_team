package com.foundersync.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String STARTUP_EXCHANGE    = "foundersync.startup.exchange";
    public static final String POST_EXCHANGE       = "foundersync.post.exchange";
    public static final String NOTIFICATION_QUEUE  = "foundersync.notification.queue";

    @Bean
    public TopicExchange startupExchange() {
        return new TopicExchange(STARTUP_EXCHANGE);
    }

    @Bean
    public TopicExchange postExchange() {
        return new TopicExchange(POST_EXCHANGE);
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable(NOTIFICATION_QUEUE).build();
    }

    @Bean
    public Binding startupNotificationBinding() {
        return BindingBuilder
                .bind(notificationQueue())
                .to(startupExchange())
                .with("#");
    }

    @Bean
    public Binding postNotificationBinding() {
        return BindingBuilder
                .bind(notificationQueue())
                .to(postExchange())
                .with("#");
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