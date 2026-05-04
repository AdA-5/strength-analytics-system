"""
Strength calculation formulas
Brzycki and Epley formulas for 1RM estimation
"""

def calculate_one_rep_max(weight_kg, reps):
    """
    Calculate estimated one-rep maximum using appropriate formula
    
    Args:
        weight_kg: Weight lifted in kilograms
        reps: Number of repetitions performed
    
    Returns:
        Estimated 1RM in kilograms
    """
    # If already lifted for 1 rep, that's the 1RM
    if reps == 1:
        return weight_kg
    
    # Brzycki formula for 2-10 reps (more accurate in this range)
    if reps <= 10:
        # Formula: 1RM = weight × (36 / (37 - reps))
        one_rm = weight_kg * (36 / (37 - reps))
        return one_rm
    
    # Epley formula for 11+ reps (better for higher reps)
    else:
        # Formula: 1RM = weight × (1 + reps/30)
        one_rm = weight_kg * (1 + reps / 30)
        return one_rm


def calculate_volume(weight_kg, reps):
    """
    Calculate total volume lifted
    
    Args:
        weight_kg: Weight lifted in kilograms
        reps: Number of repetitions performed
    
    Returns:
        Total volume in kilograms
    """
    # Volume = weight × reps
    # This represents total weight moved in the set
    volume = weight_kg * reps
    return volume


def calculate_intensity_percentage(weight_kg, one_rm_kg):
    """
    Calculate intensity as percentage of 1RM
    
    Args:
        weight_kg: Weight lifted in kilograms
        one_rm_kg: Estimated or actual 1RM in kilograms
    
    Returns:
        Intensity as percentage
    """
    if one_rm_kg == 0:
        return 0
    
    intensity = (weight_kg / one_rm_kg) * 100
    return intensity