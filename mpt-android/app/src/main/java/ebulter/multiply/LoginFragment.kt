package ebulter.multiply

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import ebulter.multiply.databinding.FragmentLoginBinding
import java.util.Locale

class LoginFragment : Fragment() {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    private val viewModel: LoginViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Show toolbar for login screen
        (requireActivity() as AppCompatActivity).supportActionBar?.show()
        (requireActivity() as AppCompatActivity).supportActionBar?.title = ""

        // Debug: Check current username
        val currentUsername = viewModel.getUsername()
        android.util.Log.d("LoginFragment", "Current username: '$currentUsername'")

        if (!currentUsername.isNullOrEmpty()) {
            android.util.Log.d("LoginFragment", "User already logged in, navigating to table selection")
            findNavController().navigate(R.id.action_loginFragment_to_tableSelectionFragment)
            return
        }

        binding.loginButton.setOnClickListener {
            val username = binding.usernameInput.text.toString()
            if (username.isNotBlank()) {
                val formattedUsername = username.trim().replaceFirstChar { it.titlecase(Locale.getDefault()) }
                viewModel.saveUsername(formattedUsername)
                findNavController().navigate(R.id.action_loginFragment_to_tableSelectionFragment)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}