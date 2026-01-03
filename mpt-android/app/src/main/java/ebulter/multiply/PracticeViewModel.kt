package ebulter.multiply

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ebulter.multiply.data.Score
import ebulter.multiply.data.ScoreRepository
import kotlinx.coroutines.launch

class PracticeViewModel(private val repository: ScoreRepository) : ViewModel() {

    private lateinit var table: String
    private lateinit var operation: String
    private var currentQuestionIndexValue = 0
    private val questions = (1..10).shuffled()
    private var startTime = 0L

    private val _question = MutableLiveData<String>()
    val question: LiveData<String> = _question

    private val _currentQuestionIndex = MutableLiveData<Int>()
    val currentQuestionIndex: LiveData<Int> = _currentQuestionIndex

    private val _totalQuestions = MutableLiveData<Int>()
    val totalQuestions: LiveData<Int> = _totalQuestions

    private val _isCorrect = MutableLiveData<Boolean?>()
    val isCorrect: LiveData<Boolean?> = _isCorrect

    private val _isFinished = MutableLiveData<Boolean>()
    val isFinished: LiveData<Boolean> = _isFinished

    fun setTable(table: String, operation: String) {
        this.table = table
        this.operation = operation
        startTime = System.currentTimeMillis()
        currentQuestionIndexValue = 0
        _totalQuestions.value = questions.size
        nextQuestion()
    }

    fun checkAnswer(answer: String, username: String) {
        val tableValue = table.replace(',', '.').toDouble()
        val multiplier = questions[currentQuestionIndexValue]
        
        val correctAnswer = if (operation == "divide") {
            multiplier.toDouble() // For division, the answer is the multiplier
        } else {
            tableValue * multiplier // For multiplication, the answer is the result
        }
        
        val userAnswer = answer.replace(',', '.').toDoubleOrNull()
        
        // Use tolerance for floating point comparison to handle precision issues
        if (userAnswer != null) {
            val difference = kotlin.math.abs(userAnswer - correctAnswer)
            if (difference < 0.0001) {
                _isCorrect.value = true
                currentQuestionIndexValue++
                _currentQuestionIndex.value = currentQuestionIndexValue
                if (currentQuestionIndexValue >= questions.size) {
                    val duration = System.currentTimeMillis() - startTime
                    val tableLabel = if (operation == "divide") ":$table" else table
                    viewModelScope.launch {
                        repository.insert(Score(username = username, table = tableLabel, duration = duration, timestamp = System.currentTimeMillis()))
                    }
                    _isFinished.value = true
                }
            } else {
                _isCorrect.value = false
            }
        } else {
            _isCorrect.value = false
        }
    }

    fun nextQuestion() {
        if (currentQuestionIndexValue < questions.size) {
            val multiplier = questions[currentQuestionIndexValue]
            val tableValue = table.replace(',', '.').toDouble()
            val result = tableValue * multiplier
            
            _question.value = if (operation == "divide") {
                // Format as integers when possible
                val formattedResult = if (result == result.toInt().toDouble()) {
                    result.toInt().toString()
                } else {
                    result.toString().replace('.', ',')
                }
                val formattedTable = if (tableValue == tableValue.toInt().toDouble()) {
                    tableValue.toInt().toString()
                } else {
                    table.toString()
                }
                "$formattedResult : $formattedTable = "
            } else {
                "$multiplier × $table = "
            }
            _currentQuestionIndex.value = currentQuestionIndexValue
            _isCorrect.value = null
        } else {
            _isFinished.value = true
        }
    }

    fun getStartTime(): Long {
        return startTime
    }
}