package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
@WebServlet(name = "LoadHomeData", urlPatterns = {"/LoadHomeData"})
public class LoadHomeData extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        String user_id = req.getParameter("id");
        String searchText = req.getParameter("searchText");

        Session session = HibernateUtil.getSessionFactory().openSession();
        User_Status user_Status = (User_Status) session.get(User_Status.class, 1);

        User user = (User) session.get(User.class, Integer.parseInt(user_id));
        user.setUser_status(user_Status);
        session.update(user);
        
        ArrayList<User> searchUsersArray = new ArrayList<>();

        if (searchText != null&&!searchText.equals("")) {
            Criteria criteria3 = session.createCriteria(User.class);
            criteria3.add(Restrictions.or(
                    Restrictions.like("firstName", searchText, MatchMode.START),
                    Restrictions.like("lastName", searchText, MatchMode.START)
            ));
            if (!criteria3.list().isEmpty()) {
                searchUsersArray = (ArrayList<User>) criteria3.list();
            }
        }
        
        if(!searchUsersArray.isEmpty()){
            for (User user1 : searchUsersArray) {
                System.out.println(user1.getFirstName());
            }
        }

        Criteria criteria1 = session.createCriteria(Chat.class);
        criteria1.add(Restrictions.or(
                Restrictions.eq("from_user", user),
                Restrictions.eq("to_user", user)
        ));

        criteria1.addOrder(Order.desc("date_time"));
        List<Chat> chats = criteria1.list();

        ArrayList<Integer> chatArray = new ArrayList<>();

        JsonArray jsonArray = new JsonArray();
        JsonArray filteredArray1 = new JsonArray();

        for (Chat chat : chats) {

            //Sent message
            if (chat.getFrom_user().getId() == user.getId()) {
                if (!chatArray.contains(chat.getTo_user().getId())) {
                    chatArray.add(chat.getTo_user().getId());

                    JsonObject jsonObject = getUserJson(chat.getTo_user(), req);

                    jsonObject.addProperty("date_time", new SimpleDateFormat("yyyy, MM dd hh:ss a").format(chat.getDate_time()));
                    jsonObject.addProperty("message", chat.getMessage());
                    jsonObject.addProperty("chat_status", "sent");
                    jsonObject.addProperty("chat_status_id", chat.getChat_Status().getId());

                    jsonArray.add(jsonObject);

                }
            } //Received message
            else {
                if (!chatArray.contains(chat.getFrom_user().getId())) {
                    chatArray.add(chat.getFrom_user().getId());

                    JsonObject jsonObject = getUserJson(chat.getFrom_user(), req);

                    jsonObject.addProperty("date_time", new SimpleDateFormat("yyyy, MM dd hh:ss a").format(chat.getDate_time()));
                    jsonObject.addProperty("message", chat.getMessage());
                    jsonObject.addProperty("chat_status", "received");
                    jsonObject.addProperty("chat_status_id", chat.getChat_Status().getId());

                    if (chat.getChat_Status().getId() == 1) {

                        Criteria criteria2 = session.createCriteria(Chat.class);
                        criteria2.add(Restrictions.and(
                                Restrictions.eq("from_user", chat.getFrom_user()),
                                Restrictions.eq("to_user", user),
                                Restrictions.eq("chat_Status", chat.getChat_Status())
                        ));
                        jsonObject.addProperty("unseen_chat_count", criteria2.list().size());
                        filteredArray1.add(jsonObject);
                    }

                    jsonArray.add(jsonObject);

                }
            }

        }

        Criteria criteria2 = session.createCriteria(User.class);
        List<User> users_with_empty_chat = criteria2.list();

        for (User user1 : users_with_empty_chat) {
            if (!chatArray.contains(user1.getId()) && user1.getId() != user.getId()) {
                JsonObject jsonObject = getUserJson(user1, req);
                jsonObject.addProperty("date_time", new SimpleDateFormat("yyyy, MMM dd hh:ss a").format(user1.getRegistered_date_time()));
                jsonObject.addProperty("message", "Say hi to new friend !");
                jsonArray.add(jsonObject);
            }
        }
        session.beginTransaction().commit();
        session.close();

        JsonObject responseJson = new JsonObject();
        responseJson.add("jsonChatArray", gson.toJsonTree(jsonArray));
        responseJson.add("filteredArray1", gson.toJsonTree(filteredArray1));

        resp.setContentType("application/json;charset=UTF-8");
        resp.getWriter().write(gson.toJson(responseJson));

    }

    public JsonObject getUserJson(User user, HttpServletRequest req) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("other_user_id", user.getId());
        jsonObject.addProperty("other_user_mobile", user.getMobile());
        jsonObject.addProperty("other_user_name", user.getFirstName() + " " + user.getLastName());
        jsonObject.addProperty("other_user_status", user.getUser_status().getId());

        String serverPath = req.getServletContext().getRealPath("");
        String otherUserImagePath = serverPath + File.separator + "profile-images" + File.separator + user.getId() + ".png";
        File profileImage = new File(otherUserImagePath);

        if (profileImage.exists()) {
            jsonObject.addProperty("image_found", true);
        } else {
            jsonObject.addProperty("image_found", false);
            jsonObject.addProperty("name_latters", user.getFirstName().charAt(0) + "" + user.getLastName().charAt(0));
        }

        return jsonObject;
    }

}
