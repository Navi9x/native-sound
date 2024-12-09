package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Type;
import entity.Professionals;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author Navindu
 */
@WebServlet(name = "LoadHomeData2", urlPatterns = {"/LoadHomeData2"})
public class LoadHomeData2 extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();

        String uid = req.getParameter("id");
        String searchText = req.getParameter("searchText");

        Session session = HibernateUtil.getSessionFactory().openSession();

        User logged_user = (User) session.get(User.class, Integer.parseInt(uid));

        //Get other users
        Criteria criteria1 = session.createCriteria(User.class);
        criteria1.add(Restrictions.ne("id", Integer.parseInt(uid)));

        if (searchText != null) {
            criteria1.add(Restrictions.or(
                    Restrictions.like("firstName", searchText, MatchMode.START),
                    Restrictions.like("lastName", searchText, MatchMode.START)
            ));
        }

        //Get logged user all chats
        Criteria criteria2 = session.createCriteria(Chat.class);
        criteria2.add(Restrictions.or(
                Restrictions.eq("from_user", logged_user),
                Restrictions.eq("to_user", logged_user)
        ));
        if (searchText != null && criteria1.list().isEmpty()) {
            criteria2.add(Restrictions.like("message", searchText, MatchMode.ANYWHERE));
            if (!criteria2.list().isEmpty()) {
                criteria1 = session.createCriteria(User.class);
                criteria1.add(Restrictions.ne("id", Integer.parseInt(uid)));
            }
        }
        criteria2.addOrder(Order.desc("date_time"));

        List<User> other_users = criteria1.list();
        List<Chat> chatList = criteria2.list();

        //To remove same chats
        ArrayList<Integer> chatFinder = new ArrayList<>();

        JsonArray jsonArray = new JsonArray();
        JsonArray jsonArray2 = new JsonArray();
        JsonArray filteredArray1 = new JsonArray();

        for (Chat chat : chatList) {

            for (User other_user : other_users) {

                if (chat.getFrom_user().getId() == other_user.getId()) {
                    //Received message
                    if (!chatFinder.contains(other_user.getId())) {
                        chatFinder.add(other_user.getId());

                        JsonObject jsonObject = getUserJson(chat.getFrom_user(), req, session, logged_user, false);

                        jsonObject.addProperty("date_time", new SimpleDateFormat("yyyy, MM dd hh:mm a").format(chat.getDate_time()));
                        jsonObject.addProperty("message", chat.getMessage());
                        jsonObject.addProperty("chat_status", "received");
                        jsonObject.addProperty("chat_status_id", chat.getChat_Status().getId());

                        if (chat.getChat_Status().getId() == 1) {

                            Criteria criteria3 = session.createCriteria(Chat.class);
                            criteria3.add(Restrictions.and(
                                    Restrictions.eq("from_user", other_user),
                                    Restrictions.eq("to_user", logged_user),
                                    Restrictions.eq("chat_Status", chat.getChat_Status())
                            ));
                            jsonObject.addProperty("unseen_chat_count", criteria3.list().size());
                            filteredArray1.add(jsonObject);
                        } else if (chat.getChat_Status().getId() == 3) {
                            jsonObject.addProperty("unseen_chat_count", 1);
                        }

                        jsonArray.add(jsonObject);

                    }

                } else if (chat.getTo_user().getId() == other_user.getId()) {
                    //Sent message
                    if (!chatFinder.contains(other_user.getId())) {
                        chatFinder.add(other_user.getId());

                        JsonObject jsonObject = getUserJson(chat.getTo_user(), req, session, logged_user, false);

                        jsonObject.addProperty("date_time", new SimpleDateFormat("yyyy, MM dd hh:mm a").format(chat.getDate_time()));
                        jsonObject.addProperty("message", chat.getMessage());
                        jsonObject.addProperty("chat_status", "sent");
                        jsonObject.addProperty("chat_status_id", chat.getChat_Status().getId());

                        jsonArray.add(jsonObject);

                    }

                } else {

                }

            }

        }

//        All users
        Criteria criteria4 = session.createCriteria(User.class);
        criteria4.add(Restrictions.ne("id", Integer.parseInt(uid)));
        if (searchText != null) {
            criteria4.add(Restrictions.or(
                    Restrictions.like("firstName", searchText, MatchMode.START),
                    Restrictions.like("lastName", searchText, MatchMode.START)
            ));
        }
        criteria4.addOrder(Order.asc("firstName"));
        List<User> users_with_empty_chat = criteria4.list();

        for (User user1 : users_with_empty_chat) {
            if (!chatFinder.contains(user1.getId())) {
                //Non chatted users
                JsonObject jsonObject = getUserJson(user1, req, session, logged_user, true);
                jsonObject.addProperty("date_time", new SimpleDateFormat("yyyy, MMM dd hh:ss a").format(user1.getRegistered_date_time()));
                jsonObject.addProperty("message", "Send a chat invitation.. 💌");
                jsonArray2.add(jsonObject);
            } else {
                //Chatted users
                JsonObject jsonObject = getUserJson(user1, req, session, logged_user, false);
                jsonArray2.add(jsonObject);
            }
        }
        session.beginTransaction().commit();
        session.close();

        JsonObject responseJson = new JsonObject();
        responseJson.add("jsonChatArray", gson.toJsonTree(jsonArray));
        responseJson.add("jsonUsersArray", gson.toJsonTree(jsonArray2));
        responseJson.add("filteredArray1", gson.toJsonTree(filteredArray1));

        resp.setContentType("application/json;charset=UTF-8");
        resp.getWriter().write(gson.toJson(responseJson));

    }

    public JsonObject getUserJson(User user, HttpServletRequest req, Session session, User loggedUser, Boolean nonChatted) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("other_user_id", user.getId());
        jsonObject.addProperty("other_user_mobile", user.getMobile());
        jsonObject.addProperty("other_user_name", user.getFirstName() + " " + user.getLastName());
        jsonObject.addProperty("other_user_status", user.getUser_status().getId());

        String languageCode = user.getLanguages().getName();
        Locale locale = new Locale(languageCode);
        String languageName = locale.getDisplayLanguage(Locale.ENGLISH);
        jsonObject.addProperty("other_user_language", languageName);

        jsonObject.addProperty("other_user_language_code", user.getLanguages().getName());

        Criteria criteria3 = session.createCriteria(Chat_Type.class);
        criteria3.add(Restrictions.and(Restrictions.eq("from_user", loggedUser), Restrictions.eq("to_user", user)));

        if (!criteria3.list().isEmpty()) {
            Chat_Type chat_Type = (Chat_Type) criteria3.list().get(0);
            jsonObject.addProperty("translate", chat_Type.getTranslate().getId());
            jsonObject.addProperty("lock", chat_Type.getIs_lock().getId());
        }

        String serverPath = req.getServletContext().getRealPath("");
        String otherUserImagePath = serverPath + File.separator + "profile-images" + File.separator + user.getId() + ".png";
        File profileImage = new File(otherUserImagePath);

        if (profileImage.exists()) {
            jsonObject.addProperty("image_found", true);
        } else {
            jsonObject.addProperty("image_found", false);
            jsonObject.addProperty("name_latters", user.getFirstName().charAt(0) + "" + user.getLastName().charAt(0));
        }

        Criteria criteria5 = session.createCriteria(Professionals.class);
        criteria5.add(Restrictions.eq("user", user));
        if (!criteria5.list().isEmpty()) {
            Professionals professionals = (Professionals) criteria5.list().get(0);
            jsonObject.addProperty("industry", professionals.getSkills().getIndustry().getName());
            jsonObject.addProperty("skill", professionals.getSkills().getName());
        }

        if (!nonChatted) {
            jsonObject.addProperty("chatted", true);
        }

        return jsonObject;
    }

}
