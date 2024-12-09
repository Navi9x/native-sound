package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Chat_DTO;
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
@WebServlet(name = "LoadChat", urlPatterns = {"/LoadChat"})
public class LoadChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        Response_DTO response_DTO = new Response_DTO();

        String logged_user_id = req.getParameter("logged_user_id");
        String other_user_id = req.getParameter("other_user_id");

        Session session = HibernateUtil.getSessionFactory().openSession();

        User logged_user = (User) session.get(User.class, Integer.parseInt(logged_user_id));
        User other_user = (User) session.get(User.class, Integer.parseInt(other_user_id));

        Criteria criteria1 = session.createCriteria(Chat.class);
        criteria1.add(Restrictions.or(
                Restrictions.and(Restrictions.eq("from_user", logged_user), Restrictions.eq("to_user", other_user)),
                Restrictions.and(Restrictions.eq("from_user", other_user), Restrictions.eq("to_user", logged_user))
        ));
        criteria1.addOrder(Order.asc("date_time"));

        //Get chat list
        List<Chat> chatList = criteria1.list();

        //Seen chat status
        Chat_Status chat_Status = (Chat_Status) session.get(Chat_Status.class, 2);

        //formatted date time
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd, hh:mm a");
        
        //Create chat array for response
        ArrayList<Chat_DTO> chatArray = new ArrayList<>();

        for (Chat chat : chatList) {

            Chat_DTO chat_DTO = new Chat_DTO();
            chat_DTO.setMessage(chat.getMessage());
            chat_DTO.setDate_time(dateFormat.format(chat.getDate_time()));
            
            if (chat.getFrom_user().getId() == other_user.getId()) {
                //Received message
                chat_DTO.setReceived(true);

                if (chat.getChat_Status().getId() == 1) {
                    chat.setChat_Status(chat_Status);
                    session.update(chat);
                }
            } else {
                
                chat_DTO.setStatus(chat.getChat_Status().getId());

            }
            chatArray.add(chat_DTO);
        }
        response_DTO.setSuccess(true);
        response_DTO.setObject(chatArray);
        session.beginTransaction().commit();
        resp.setContentType("application/json;charset=UTF-8");
        resp.getWriter().write(gson.toJson(response_DTO));

    }

}
