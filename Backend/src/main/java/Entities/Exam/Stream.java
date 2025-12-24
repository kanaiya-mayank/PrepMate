package Entities.Exam;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "STREAM_TABLE")
public class Stream {
    @Id
    @Column(name = "NAME_PK")
    private String streamName;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "EXAN_NAME_FK")
    private Exam exam;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "JOIN_STREAM_SUBJECT",
            joinColumns = { @JoinColumn(name = "STREAM_FK") },
            inverseJoinColumns = {@JoinColumn(name = "SUBJECT_FK")}
    )
    private Set<Subject> subjects;


    public String getStreamName() {
        return streamName;
    }

    public void setStreamName(String streamName) {
        this.streamName = streamName;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public Set<Subject> getSubjects() {
        return subjects;
    }

    public void setSubjects(Set<Subject> subjects) {
        this.subjects = subjects;
    }
}
