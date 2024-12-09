package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Navindu
 */
@WebServlet(name = "CheckImage", urlPatterns = {"/CheckImage"})
public class CheckImage extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        String id = req.getParameter("id");

        String serverPath = req.getServletContext().getRealPath("");
        String otherUserImagePath = serverPath + File.separator + "profile-images" + File.separator + id + ".png";
        File profileImage = new File(otherUserImagePath);
        
        JsonObject jsonObject = new JsonObject();
        if(profileImage.exists()){
            jsonObject.addProperty("Image_found", true);
        }else{
            jsonObject.addProperty("Image_found", false);
        }
        
        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(jsonObject));
    }

}
