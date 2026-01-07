package ebulter.multiply

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import com.google.android.material.button.MaterialButton
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.core.os.bundleOf
import com.google.android.material.snackbar.Snackbar
import ebulter.multiply.databinding.FragmentPracticeBinding
import androidx.activity.OnBackPressedCallback

class PracticeFragment : Fragment() {

    private var _binding: FragmentPracticeBinding? = null
    private val binding get() = _binding!!

    private val viewModel: PracticeViewModel by viewModels { ViewModelFactory(requireActivity().application) }
    private val loginViewModel: LoginViewModel by activityViewModels()
    private val args: PracticeFragmentArgs by navArgs()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentPracticeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Hide toolbar completely
        val actionBar = (requireActivity() as AppCompatActivity).supportActionBar
        actionBar?.hide()
        actionBar?.title = ""

        // Override back button to always return to table selection
        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                findNavController().navigate(R.id.action_practiceFragment_to_tableSelectionFragment)
            }
        })

        viewModel.setTable(args.table, args.operation)

        viewModel.question.observe(viewLifecycleOwner) {
            val title = if (args.operation == "divide") {
                "Delen door ${args.table}"
            } else {
                "Tafel van ${args.table}"
            }
            binding.questionText.text = title
            binding.questionDisplay.text = it
            binding.answerDisplay.text = ""
            binding.feedbackMessage.visibility = View.GONE
        }

        viewModel.currentQuestionIndex.observe(viewLifecycleOwner) { index ->
            viewModel.totalQuestions.observe(viewLifecycleOwner) { total ->
                binding.progressText.text = "Vraag ${index + 1} van $total"
            }
        }

        viewModel.isCorrect.observe(viewLifecycleOwner) { isCorrect ->
            when (isCorrect) {
                true -> {
                    binding.feedbackMessage.visibility = View.VISIBLE
                    binding.feedbackMessage.text = "Goed!"
                    binding.feedbackMessage.setBackgroundResource(R.drawable.feedback_background_success)
                    Handler(Looper.getMainLooper()).postDelayed({ viewModel.nextQuestion() }, 1000)
                }
                false -> {
                    binding.feedbackMessage.visibility = View.VISIBLE
                    binding.feedbackMessage.text = "Fout, probeer opnieuw"
                    binding.feedbackMessage.setBackgroundResource(R.drawable.feedback_background)
                    // Clear the wrong answer
                    binding.answerDisplay.text = ""
                }
                null -> {
                    binding.feedbackMessage.visibility = View.GONE
                }
            }
        }

        viewModel.isFinished.observe(viewLifecycleOwner) {
            if (it) {
                val duration = System.currentTimeMillis() - viewModel.getStartTime()
                findNavController().navigate(
                    R.id.action_practiceFragment_to_completionFragment,
                    bundleOf(
                        "table" to args.table,
                        "duration" to duration
                    )
                )
            }
        }

        setupKeypad()

        binding.submitButton.setOnClickListener {
            val username = loginViewModel.getUsername() ?: ""
            viewModel.checkAnswer(binding.answerDisplay.text.toString(), username)
        }

        binding.stopButton.setOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun setupKeypad() {
        val keypadButtons = listOf(
            binding.keypad0, binding.keypad1, binding.keypad2, binding.keypad3, binding.keypad4,
            binding.keypad5, binding.keypad6, binding.keypad7, binding.keypad8, binding.keypad9
        )

        keypadButtons.forEach { button ->
            button?.setOnClickListener { onNumberClicked(it as MaterialButton) }
        }

        binding.keypadDecimal?.setOnClickListener { onDecimalClicked() }
        binding.keypadBackspace?.setOnClickListener { onBackspaceClicked() }
    }

    private fun onNumberClicked(button: MaterialButton) {
        binding.answerDisplay.append(button.text)
    }

    private fun onDecimalClicked() {
        if (!binding.answerDisplay.text.contains(",")) {
            binding.answerDisplay.append(",")
        }
    }

    private fun onBackspaceClicked() {
        val currentText = binding.answerDisplay.text
        if (currentText.isNotEmpty()) {
            binding.answerDisplay.text = currentText.substring(0, currentText.length - 1)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        // Show toolbar again when leaving this fragment
        (requireActivity() as AppCompatActivity).supportActionBar?.show()
        _binding = null
    }
}