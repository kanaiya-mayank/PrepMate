package Entities.Exam;
import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "CHAPTER_TABLE")
public class Chapter {

    @Id
    private String id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "SUBJECT_FK")
    private Subject subject;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Topic> topics;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Set<Topic> getTopics() {
        return topics;
    }

    public void setTopics(Set<Topic> topics) {
        this.topics = topics;
    }
}
