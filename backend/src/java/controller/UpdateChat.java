package controller;

import com.google.gson.Gson;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import java.io.IOException;
import java.util.List;
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
@WebServlet(name = "UpdateChat", urlPatterns = {"/UpdateChat"})
public class UpdateChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        Response_DTO response_DTO = new Response_DTO();

        String other_user_id = req.getParameter("other_user_id");
        String logged_user_id = req.getParameter("logged_user_id");
        String update_status = req.getParameter("update_status");

        Session session = HibernateUtil.getSessionFactory().openSession();
        User other_user = (User) session.get(User.class, Integer.parseInt(other_user_id));
        User logged_user = (User) session.get(User.class, Integer.parseInt(logged_user_id));
        Chat_Status chat_Status = (Chat_Status) session.get(Chat_Status.class, Integer.parseInt(update_status));

        Criteria criteria1 = session.createCriteria(Chat.class);
        criteria1.add(Restrictions.or(
                Restrictions.and(Restrictions.eq("from_user", logged_user), Restrictions.eq("to_user", other_user)),
                Restrictions.and(Restrictions.eq("from_user", other_user), Restrictions.eq("to_user", logged_user))
        ));
        criteria1.addOrder(Order.desc("date_time"));

        Chat chat = (Chat) criteria1.list().get(0);
        chat.setChat_Status(chat_Status);
        try {
            session.beginTransaction().commit();
            response_DTO.setSuccess(true);
        } catch (Exception e) {
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(response_DTO));
    }

}
