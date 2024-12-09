package controller;

import entity.Chat;
import entity.Chat_Status;
import entity.Chat_Type;
import entity.Type_Status;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Navindu
 */
@WebServlet(name = "UpdateChatType", urlPatterns = {"/UpdateChatType"})
public class UpdateChatType extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String from_user_id = req.getParameter("from_user_id");
        String to_user_id = req.getParameter("to_user_id");
        String translate = req.getParameter("translate");
        String lock = req.getParameter("lock");
        String block = req.getParameter("block");

        boolean isTranslate = Boolean.parseBoolean(translate);
        boolean isLock = Boolean.parseBoolean(lock);
        boolean isBlock = Boolean.parseBoolean(block);

        Session session = HibernateUtil.getSessionFactory().openSession();
        User from_user = (User) session.get(User.class, Integer.parseInt(from_user_id));
        User to_user = (User) session.get(User.class, Integer.parseInt(to_user_id));

        Type_Status on_status = (Type_Status) session.get(Type_Status.class, 1);
        Type_Status off_status = (Type_Status) session.get(Type_Status.class, 2);

        Criteria criteria1 = session.createCriteria(Chat_Type.class);
        criteria1.add(Restrictions.eq("from_user", from_user));
        criteria1.add(Restrictions.eq("to_user", to_user));

        if (isTranslate) {
            if (criteria1.list().isEmpty()) {
                Chat_Type chat_Type = new Chat_Type();
                chat_Type.setFrom_user(from_user);
                chat_Type.setTo_user(to_user);
                chat_Type.setIs_lock(off_status);
                chat_Type.setTranslate(on_status);
                session.save(chat_Type);
                System.out.println("Success");
            } else {
                Chat_Type chat_Type = (Chat_Type) criteria1.uniqueResult();
                chat_Type.setTranslate(on_status);
                if (!isLock) {
                    chat_Type.setIs_lock(off_status);
                }
                session.update(chat_Type);
                System.out.println("Success");
            }
        }

        if (isLock) {
            if (criteria1.list().isEmpty()) {
                Chat_Type chat_Type = new Chat_Type();
                chat_Type.setFrom_user(from_user);
                chat_Type.setTo_user(to_user);
                chat_Type.setIs_lock(on_status);
                chat_Type.setTranslate(off_status);
                session.save(chat_Type);
                System.out.println("Success");
            } else {
                Chat_Type chat_Type = (Chat_Type) criteria1.uniqueResult();
                chat_Type.setIs_lock(on_status);
                if (!isTranslate) {
                    chat_Type.setTranslate(off_status);
                }
                session.update(chat_Type);
                System.out.println("Success");
            }
        }

        if (!isLock && !isTranslate && !criteria1.list().isEmpty()) {

            Chat_Type chat_Type = (Chat_Type) criteria1.uniqueResult();
            session.delete(chat_Type);

        }

        //Block and Unblock
        Chat_Status block_Status = (Chat_Status) session.get(Chat_Status.class, 4);
        Chat_Status unblock_Status = (Chat_Status) session.get(Chat_Status.class, 2);

        Criteria criteria2 = session.createCriteria(Chat.class);
        criteria2.add(Restrictions.or(
                Restrictions.and(Restrictions.eq("from_user", from_user), Restrictions.eq("to_user", to_user)),
                Restrictions.and(Restrictions.eq("from_user", to_user), Restrictions.eq("to_user", from_user))
        ));
        criteria2.addOrder(Order.desc("date_time"));

        if (isBlock) {
            System.out.println("Block");

            Chat chat = (Chat) criteria2.list().get(0);

            if (chat.getChat_Status().getId() != 4) {
                chat.setChat_Status(block_Status);
                session.update(chat);
                System.out.println("done");
            }

        } else {
            System.out.println("Unblock");
            Chat chat = (Chat) criteria2.list().get(0);

            if (chat.getChat_Status().getId() == 4) {
                chat.setChat_Status(unblock_Status);
                session.update(chat);
                System.out.println("done");
            }
        }

        session.beginTransaction().commit();

    }

}
