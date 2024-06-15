package br.com.curiobot;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@SuppressWarnings("deprecation")
public class EchoBot extends TelegramLongPollingBot {
    @Override
    public String getBotUsername() {
        return Credentials.BOT_USER_NAME;
    }

    @Override
    public String getBotToken() {
        return Credentials.BOT_TOKEN;
    }

    @Override
    public void onUpdateReceived(Update update) {
        var message = toRespond(update);
        try {
            execute(message);
        } catch  (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    private SendMessage toRespond(Update update) {
        var textMessage = update.getMessage().getText().toLowerCase();
        var chatId = update.getMessage().getChatId().toString();
        var answer = " ";
        if (textMessage.startsWith("/registrarproblema")) {
            answer = "⌨️ Descreva o problema encontrado: ";
        } else if (textMessage.startsWith("/sair")) {
            answer = "Para recomeçar novamente a conversa click ou digitar /start" +
            "🏃Saindo da conversa...";
            return SendMessage.builder()
                .text(answer)
                .chatId(chatId)
                .build();
        } else {
            answer = "🔨 Curió BOT 👨🏼‍🔧 \n" +
                "Olá, sou um robô para você relatar os problemas encontrados em sua cidade \n" +
                "/sair - para sair da conversa (Em qualquer momento) 🛑 \n" +
                "/registrarProblema - para fazer o registro de um problema ✍️";
        }
        return SendMessage.builder()
            .text(answer)
            .chatId(chatId)
            .build();
    }
}



