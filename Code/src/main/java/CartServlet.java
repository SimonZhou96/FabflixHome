import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CartServlet", urlPatterns = {"/api/cart"})
public class CartServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String movieId = request.getParameter("id");
        movieId = movieId.split("_")[1];

        PrintWriter out = response.getWriter();
        try {
            if (request.getSession().getAttribute("cart") == null) {
                Cart cart = new Cart();
                request.getSession().setAttribute("cart", cart);
            }
            Cart cart = (Cart) request.getSession().getAttribute("cart");
            cart.movieQuantity.putIfAbsent(movieId, cart.movieQuantity.getOrDefault(movieId, 0) + 1);
            response.setStatus(200);
        } catch (Exception e) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("errorMessage", e.getMessage());
            out.write(jsonObject.toString());
            response.setStatus(500);
        } finally {
            out.close();
        }
    }
}
