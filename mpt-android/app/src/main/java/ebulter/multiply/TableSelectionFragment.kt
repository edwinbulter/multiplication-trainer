package ebulter.multiply

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.GridLayoutManager
import ebulter.multiply.databinding.FragmentTableSelectionBinding

class TableSelectionFragment : Fragment() {

    private var _binding: FragmentTableSelectionBinding? = null
    private val binding get() = _binding!!

    private val viewModel: TableSelectionViewModel by viewModels()
    private val loginViewModel: LoginViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentTableSelectionBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Hide toolbar
        (requireActivity() as AppCompatActivity).supportActionBar?.hide()

        loginViewModel.getUsername()?.let {
            binding.welcomeMessage.text = "Welkom $it!"
        }

        val adapter = TablesAdapter(viewModel.tables) { table ->
            val operation = when (binding.operationToggleGroup.checkedButtonId) {
                R.id.multiply_button -> "multiply"
                R.id.divide_button -> "divide"
                else -> "multiply" // Default fallback
            }
            val action = TableSelectionFragmentDirections.actionTableSelectionFragmentToPracticeFragment(table, operation)
            findNavController().navigate(action)
        }

        binding.tablesRecyclerView.adapter = adapter
        binding.tablesRecyclerView.layoutManager = GridLayoutManager(context, 3)

        binding.viewScoreboardButton.setOnClickListener {
            findNavController().navigate(R.id.action_tableSelectionFragment_to_scoreboardFragment)
        }

        binding.startCustomTableButton.setOnClickListener {
            val customTable = binding.customTableInput.text.toString()
            if (customTable.isNotBlank()) {
                val operation = when (binding.operationToggleGroup.checkedButtonId) {
                    R.id.multiply_button -> "multiply"
                    R.id.divide_button -> "divide"
                    else -> "multiply" // Default fallback
                }
                val action = TableSelectionFragmentDirections.actionTableSelectionFragmentToPracticeFragment(customTable, operation)
                findNavController().navigate(action)
            }
        }

        binding.logoutButton.setOnClickListener {
            // Debug: Check if button click is working
            android.util.Log.d("TableSelection", "Logout button clicked")
            loginViewModel.saveUsername("") // Clear username
            android.util.Log.d("TableSelection", "Username cleared, navigating to login")
            findNavController().navigate(R.id.action_tableSelectionFragment_to_loginFragment)
        }

        // Set default selection to multiplication
        binding.operationToggleGroup.check(R.id.multiply_button)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        // Show toolbar again when leaving this fragment
        (requireActivity() as AppCompatActivity).supportActionBar?.show()
        _binding = null
    }
}