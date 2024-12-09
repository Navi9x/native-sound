package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import model.Response_DTO;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Navindu
 */
@WebServlet(name = "SendMessage", urlPatterns = {"/SendMessage"})
public class SendMessage extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        Response_DTO response_DTO = new Response_DTO();

        String from_user_id = req.getParameter("from_user_id");
        String to_user_id = req.getParameter("to_user_id");
        String message = req.getParameter("message");

        Session session = HibernateUtil.getSessionFactory().openSession();
        Chat_Status chat_Status = (Chat_Status) session.get(Chat_Status.class, 1);
        Chat_Status pending_chat_Status = (Chat_Status) session.get(Chat_Status.class, 3);
        User from_user = (User) session.get(User.class, Integer.parseInt(from_user_id));
        User to_user = (User) session.get(User.class, Integer.parseInt(to_user_id));

        Criteria criteria1 = session.createCriteria(Chat.class);
        criteria1.add(Restrictions.or(
                Restrictions.and(Restrictions.eq("from_user", from_user), Restrictions.eq("to_user", to_user)),
                Restrictions.and(Restrictions.eq("from_user", to_user), Restrictions.eq("to_user", from_user))
        ));
        criteria1.addOrder(Order.desc("date_time"));

        if (criteria1.list().isEmpty()) {
            Chat chat = new Chat();
            chat.setFrom_user(from_user);
            chat.setTo_user(to_user);
            chat.setMessage(message);
            chat.setDate_time(new Date());
            chat.setChat_Status(pending_chat_Status);
            session.save(chat);

            try {
                session.beginTransaction().commit();
                response_DTO.setSuccess(true);
            } catch (Exception e) {
            }
        } else {
            Chat latest_chat = (Chat) criteria1.list().get(0);
            int chat_status_id = latest_chat.getChat_Status().getId();

            if (chat_status_id == 1 || chat_status_id == 2) {
                Chat chat = new Chat();
                chat.setFrom_user(from_user);
                chat.setTo_user(to_user);
                chat.setMessage(message);
                chat.setDate_time(new Date());
                chat.setChat_Status(chat_Status);
                session.save(chat);

                try {
                    session.beginTransaction().commit();
                    response_DTO.setSuccess(true);
                } catch (Exception e) {
                }

            } else if (chat_status_id == 3) {
                response_DTO.setMessage("pending");
            } else {
                response_DTO.setMessage("blocked");
            }

        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(response_DTO));

    }
}
