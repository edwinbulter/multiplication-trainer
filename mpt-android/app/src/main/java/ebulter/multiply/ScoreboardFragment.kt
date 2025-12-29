package ebulter.multiply

import android.os.Bundle
import android.view.*
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import ebulter.multiply.databinding.FragmentScoreboardBinding

class ScoreboardFragment : Fragment() {

    private var _binding: FragmentScoreboardBinding? = null
    private val binding get() = _binding!!

    private val viewModel: ScoreboardViewModel by viewModels { ViewModelFactory(requireActivity().application) }
    private val loginViewModel: LoginViewModel by activityViewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentScoreboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Completely hide toolbar and remove any title
        val actionBar = (requireActivity() as androidx.appcompat.app.AppCompatActivity).supportActionBar
        actionBar?.hide()
        actionBar?.title = ""
        
        // Also hide any system UI for full screen experience
        requireActivity().window.decorView.systemUiVisibility = 
            android.view.View.SYSTEM_UI_FLAG_FULLSCREEN

        val adapter = ScoreboardAdapter()
        binding.scoresRecyclerView.adapter = adapter
        binding.scoresRecyclerView.layoutManager = LinearLayoutManager(context)

        // Show scores for current user only
        loginViewModel.getUsername()?.let { username ->
            viewModel.getScoresForUser(username).observe(viewLifecycleOwner) { scores ->
                adapter.submitListWithOriginal(scores)
            }
        }

        // Header click listeners for sorting
        binding.headerTable.setOnClickListener {
            adapter.sortByTable()
            updateHeaderIndicators()
        }

        binding.headerDuration.setOnClickListener {
            adapter.sortByDuration()
            updateHeaderIndicators()
        }

        binding.headerDatetime.setOnClickListener {
            adapter.sortByDateTime()
            updateHeaderIndicators()
        }

        binding.clearButton.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle("Wis Scorebord")
                .setMessage("Weet je zeker dat je het scoreboard wilt wissen?")
                .setPositiveButton("Ja") { _, _ -> viewModel.clearScores() }
                .setNegativeButton("Nee", null)
                .show()
        }

        binding.backButton.setOnClickListener {
            findNavController().navigate(R.id.action_scoreboardFragment_to_tableSelectionFragment)
        }
    }

    private fun updateHeaderIndicators() {
        // Update header text to show current sort direction
        // This is a simplified version - you could enhance this to show actual sort state
        binding.headerTable.text = "Tafel ↕"
        binding.headerDuration.text = "Sec ↕"
        binding.headerDatetime.text = "Datum/tijd ↕"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}